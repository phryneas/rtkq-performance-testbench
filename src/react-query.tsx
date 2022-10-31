import {baseQuery} from "./store";
import {useQuery} from "@tanstack/react-query";

export default function ReactQuery({ arg, skip }: { arg: string; skip: boolean }) {
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
