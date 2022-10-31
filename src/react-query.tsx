import {baseQuery} from "./store";
import {useQuery, useQueryClient} from "@tanstack/react-query";

export function Child({ arg, skip }: { arg: string; skip: boolean }) {
    const result = useQuery({
        queryKey: [arg],
        queryFn: () => baseQuery(arg),
        enabled: !skip
    });
    return (
        <div>
            {result.isInitialLoading
                ? "isLoading"
                : result.isLoading && !result.isFetching
                    ? "uninitialized"
                    : `${result.data?.data} ${result.isFetching ? "(fetching)" : ""}`}
        </div>
    );
}

export const Invalidate = () => {
    const queryClient = useQueryClient()

    return <button onClick={() => queryClient.invalidateQueries()}>
        invalidate
    </button>
}