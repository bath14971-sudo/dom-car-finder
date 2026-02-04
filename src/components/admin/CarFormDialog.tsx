import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCar, useUpdateCar, type Car, type CarStatus } from "@/hooks/useCars";
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  price: z.coerce.number().min(0),
  status: z.enum(["ready", "onroad", "luxury", "plate"]),
  viewers: z.coerce.number().min(0).default(0),
  image: z.string().url("Must be a valid URL"),
  bodyType: z.string().min(1, "Body type is required"),
  taxStatus: z.string().min(1, "Tax status is required"),
  condition: z.string().min(1, "Condition is required"),
  fuelType: z.string().min(1, "Fuel type is required"),
  color: z.string().min(1, "Color is required"),
  description: z.string(),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface CarFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  car: Car | null;
}

const CarFormDialog = ({ open, onOpenChange, car }: CarFormDialogProps) => {
  const createCar = useCreateCar();
  const updateCar = useUpdateCar();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      status: "ready",
      viewers: 0,
      image: "",
      bodyType: "Sedan",
      taxStatus: "Tax slip",
      condition: "Excellent",
      fuelType: "Petrol",
      color: "White",
      description: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (car) {
      form.reset({
        code: car.code,
        name: car.name,
        model: car.model,
        year: car.year,
        price: car.price,
        status: car.status,
        viewers: car.viewers,
        image: car.image,
        bodyType: car.bodyType,
        taxStatus: car.taxStatus,
        condition: car.condition,
        fuelType: car.fuelType,
        color: car.color,
        description: car.description.join("\n"),
        isActive: car.isActive ?? true,
      });
    } else {
      form.reset({
        code: "",
        name: "",
        model: "",
        year: new Date().getFullYear(),
        price: 0,
        status: "ready",
        viewers: 0,
        image: "",
        bodyType: "Sedan",
        taxStatus: "Tax slip",
        condition: "Excellent",
        fuelType: "Petrol",
        color: "White",
        description: "",
        isActive: true,
      });
    }
  }, [car, form]);

  const onSubmit = (values: FormValues) => {
    const carData = {
      ...values,
      images: [values.image],
      description: values.description.split("\n").filter(Boolean),
    };

    if (car) {
      updateCar.mutate(
        { id: car.id, ...carData },
        {
          onSuccess: () => onOpenChange(false),
        }
      );
    } else {
      createCar.mutate(carData as Parameters<typeof createCar.mutate>[0], {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  const isLoading = createCar.isPending || updateCar.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{car ? "Edit Car" : "Add New Car"}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <Input placeholder="DCS2024_..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Toyota Camry SE" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input placeholder="Toyota Camry" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ready">Ready car</SelectItem>
                          <SelectItem value="onroad">On-road car</SelectItem>
                          <SelectItem value="luxury">Luxury car</SelectItem>
                          <SelectItem value="plate">With licence plate</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid sm:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="bodyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Body Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Sedan">Sedan</SelectItem>
                          <SelectItem value="SUV">SUV</SelectItem>
                          <SelectItem value="Hatchback">Hatchback</SelectItem>
                          <SelectItem value="Coupe">Coupe</SelectItem>
                          <SelectItem value="Truck">Truck</SelectItem>
                          <SelectItem value="Van">Van</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fuelType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fuel Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Petrol">Petrol</SelectItem>
                          <SelectItem value="Diesel">Diesel</SelectItem>
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
                          <SelectItem value="Electric">Electric</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input placeholder="White" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="taxStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Tax slip">Tax slip</SelectItem>
                          <SelectItem value="Tax paid">Tax paid</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condition</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Excellent">Excellent</SelectItem>
                          <SelectItem value="Very Good">Very Good</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Fair">Fair</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (one point per line)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Six-month warranty on the engine...&#10;Financing available..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Active</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Show this car on the public website
                      </p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : car ? "Update Car" : "Add Car"}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CarFormDialog;
