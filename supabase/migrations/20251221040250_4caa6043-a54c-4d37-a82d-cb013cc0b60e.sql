-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'security_guard', 'store_manager', 'plant_manager', 'finance_head', 'viewer');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  department TEXT,
  plant TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Create screen_permissions table for assigning screens to roles
CREATE TABLE public.screen_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role app_role NOT NULL,
  screen_path TEXT NOT NULL,
  screen_name TEXT NOT NULL,
  can_view BOOLEAN DEFAULT true,
  can_create BOOLEAN DEFAULT false,
  can_edit BOOLEAN DEFAULT false,
  can_delete BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (role, screen_path)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screen_permissions ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to get user roles
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id UUID)
RETURNS SETOF app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all profiles"
ON public.profiles FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for screen_permissions
CREATE POLICY "Authenticated users can view permissions"
ON public.screen_permissions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage permissions"
ON public.screen_permissions FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    NEW.email
  );
  
  -- Assign default 'viewer' role to new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'viewer');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default screen permissions for all roles
INSERT INTO public.screen_permissions (role, screen_path, screen_name, can_view, can_create, can_edit, can_delete) VALUES
-- Admin has full access
('admin', '/', 'Dashboard', true, true, true, true),
('admin', '/inbound', 'Inbound Entry', true, true, true, true),
('admin', '/outbound', 'Outbound Delivery', true, true, true, true),
('admin', '/rgp', 'RGP Management', true, true, true, true),
('admin', '/nrgp', 'NRGP Management', true, true, true, true),
('admin', '/visitors', 'Visitor Management', true, true, true, true),
('admin', '/weighbridge', 'Weighbridge', true, true, true, true),
('admin', '/settings', 'Settings', true, true, true, true),
-- Security Guard
('security_guard', '/', 'Dashboard', true, false, false, false),
('security_guard', '/inbound', 'Inbound Entry', true, true, true, false),
('security_guard', '/outbound', 'Outbound Delivery', true, true, true, false),
('security_guard', '/visitors', 'Visitor Management', true, true, true, false),
('security_guard', '/weighbridge', 'Weighbridge', true, true, false, false),
-- Store Manager
('store_manager', '/', 'Dashboard', true, false, false, false),
('store_manager', '/inbound', 'Inbound Entry', true, true, true, true),
('store_manager', '/outbound', 'Outbound Delivery', true, true, true, true),
('store_manager', '/rgp', 'RGP Management', true, true, true, true),
('store_manager', '/nrgp', 'NRGP Management', true, true, true, false),
-- Plant Manager
('plant_manager', '/', 'Dashboard', true, false, false, false),
('plant_manager', '/rgp', 'RGP Management', true, true, true, true),
('plant_manager', '/nrgp', 'NRGP Management', true, true, true, true),
('plant_manager', '/settings', 'Settings', true, false, false, false),
-- Finance Head
('finance_head', '/', 'Dashboard', true, false, false, false),
('finance_head', '/nrgp', 'NRGP Management', true, false, true, true),
('finance_head', '/settings', 'Settings', true, false, false, false),
-- Viewer
('viewer', '/', 'Dashboard', true, false, false, false),
('viewer', '/inbound', 'Inbound Entry', true, false, false, false),
('viewer', '/outbound', 'Outbound Delivery', true, false, false, false),
('viewer', '/rgp', 'RGP Management', true, false, false, false),
('viewer', '/nrgp', 'NRGP Management', true, false, false, false),
('viewer', '/visitors', 'Visitor Management', true, false, false, false),
('viewer', '/weighbridge', 'Weighbridge', true, false, false, false);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();