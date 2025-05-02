import { useQuery } from "@tanstack/react-query";
import { 
  CategoryService, 
  type Category 
} from "@/client/services/CategoryService";

export const useCategories = () => {
  // Fetch all categories
  const {
    data: categories,
    isLoading,
    error,
    refetch
  } = useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        return await CategoryService.getCategories();
      } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }
    },
    retry: 1
  });

  return {
    categories: categories || [],
    isLoading,
    error,
    refetch
  };
};

export default useCategories;
