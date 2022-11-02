import { 
  configureStore,
 autoBatchEnhancer
} from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";

export const config = {
  minimumRequestDuration: 50,
  maximumRequestDuration: 100,
  requestsPerArg: {} as Record<string, number>
};

export const baseQuery = (arg: string) => {
  return new Promise<{ data: string }>(resolve => {
    config.requestsPerArg[arg] ??= 0
    const nextNumber = ++config.requestsPerArg[arg]
    const duration = config.minimumRequestDuration + Math.random() * (config.maximumRequestDuration - config.minimumRequestDuration)
    setTimeout(() => resolve({data: `${arg}${nextNumber}`}), duration)
  })
}

export const api = createApi({
  baseQuery,
  tagTypes: ['QUERY'],
  endpoints: build => ({
    some: build.query({
      query: (arg: string) => arg,
      providesTags: ['QUERY']
    }),
  })
})

export const {useSomeQuery} = api;

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware(gDm){
    return gDm({immutableCheck: false, serializableCheck: false}).concat(api.middleware)
  },
  enhancers: (existingEnhancers) => existingEnhancers.concat(autoBatchEnhancer())

})