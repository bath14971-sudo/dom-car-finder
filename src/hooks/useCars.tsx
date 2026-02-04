import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type CarStatus = "ready" | "onroad" | "luxury" | "plate";

export interface Car {
  id: string;
  code: string;
  name: string;
  model: string;
  year: number;
  price: number;
  status: CarStatus;
  viewers: number;
  image: string;
  images: string[];
  bodyType: string;
  taxStatus: string;
  condition: string;
  fuelType: string;
  color: string;
  description: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface DbCar {
  id: string;
  code: string;
  name: string;
  model: string;
  year: number;
  price: number;
  status: string;
  viewers: number;
  image: string;
  images: string[];
  body_type: string;
  tax_status: string;
  condition: string;
  fuel_type: string;
  color: string;
  description: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const mapDbCarToCar = (dbCar: DbCar): Car => ({
  id: dbCar.id,
  code: dbCar.code,
  name: dbCar.name,
  model: dbCar.model,
  year: dbCar.year,
  price: Number(dbCar.price),
  status: dbCar.status as CarStatus,
  viewers: dbCar.viewers,
  image: dbCar.image,
  images: dbCar.images,
  bodyType: dbCar.body_type,
  taxStatus: dbCar.tax_status,
  condition: dbCar.condition,
  fuelType: dbCar.fuel_type,
  color: dbCar.color,
  description: dbCar.description,
  isActive: dbCar.is_active,
  createdAt: dbCar.created_at,
  updatedAt: dbCar.updated_at,
});

export const useCars = () => {
  return useQuery({
    queryKey: ["cars"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data as DbCar[]).map(mapDbCarToCar);
    },
  });
};

export const useCarById = (id: string) => {
  return useQuery({
    queryKey: ["car", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      return mapDbCarToCar(data as DbCar);
    },
    enabled: !!id,
  });
};

export const useCreateCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (car: Omit<Car, "id" | "createdAt" | "updatedAt">) => {
      const { data, error } = await supabase
        .from("cars")
        .insert({
          code: car.code,
          name: car.name,
          model: car.model,
          year: car.year,
          price: car.price,
          status: car.status,
          viewers: car.viewers || 0,
          image: car.image,
          images: car.images,
          body_type: car.bodyType,
          tax_status: car.taxStatus,
          condition: car.condition,
          fuel_type: car.fuelType,
          color: car.color,
          description: car.description,
          is_active: car.isActive ?? true,
        })
        .select()
        .single();

      if (error) throw error;
      return mapDbCarToCar(data as DbCar);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      toast.success("Car added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add car: " + error.message);
    },
  });
};

export const useUpdateCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...car }: Partial<Car> & { id: string }) => {
      const updateData: Record<string, unknown> = {};
      
      if (car.code !== undefined) updateData.code = car.code;
      if (car.name !== undefined) updateData.name = car.name;
      if (car.model !== undefined) updateData.model = car.model;
      if (car.year !== undefined) updateData.year = car.year;
      if (car.price !== undefined) updateData.price = car.price;
      if (car.status !== undefined) updateData.status = car.status;
      if (car.viewers !== undefined) updateData.viewers = car.viewers;
      if (car.image !== undefined) updateData.image = car.image;
      if (car.images !== undefined) updateData.images = car.images;
      if (car.bodyType !== undefined) updateData.body_type = car.bodyType;
      if (car.taxStatus !== undefined) updateData.tax_status = car.taxStatus;
      if (car.condition !== undefined) updateData.condition = car.condition;
      if (car.fuelType !== undefined) updateData.fuel_type = car.fuelType;
      if (car.color !== undefined) updateData.color = car.color;
      if (car.description !== undefined) updateData.description = car.description;
      if (car.isActive !== undefined) updateData.is_active = car.isActive;

      const { data, error } = await supabase
        .from("cars")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return mapDbCarToCar(data as DbCar);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      toast.success("Car updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update car: " + error.message);
    },
  });
};

export const useDeleteCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cars").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      toast.success("Car deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete car: " + error.message);
    },
  });
};

export const getStatusLabel = (status: CarStatus): string => {
  switch (status) {
    case "ready":
      return "Ready car";
    case "onroad":
      return "On-road car";
    case "luxury":
      return "Luxury car";
    case "plate":
      return "With licence plate";
    default:
      return status;
  }
};
