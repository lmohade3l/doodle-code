import { useQuery } from "@tanstack/react-query";

export function useCompanies({q} : {q: string}) {
        return useQuery({
                queryKey: ['companies' , q],
                queryFn: () => {}
        })
}