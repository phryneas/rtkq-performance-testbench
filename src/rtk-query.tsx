import {useSomeQuery} from "./store";

export default function RtkQuery({ arg, skip }: { arg: string; skip: boolean }) {
    const result = useSomeQuery(arg, { skip });
    return (
        <div>
            {result.isUninitialized
                ? "uninitialized"
                : result.isLoading
                    ? "isLoading"
                    : `${result.data} ${result.isFetching ? "(fetching)" : ""}`}
        </div>
    );
}
