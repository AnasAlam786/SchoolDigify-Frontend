import { useQuery } from "@tanstack/react-query";
import { fetchClasses } from "../pages/utils/fetchClasses";

export function useClasses() {
    return useQuery({
        queryKey: ["classes"],
        queryFn: fetchClasses,
        staleTime: 5 * 60 * 1000,
    });
}