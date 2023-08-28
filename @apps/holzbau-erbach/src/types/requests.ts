export interface ExecutingRequest<T = any> {
  key: string
  promise: Promise<T>
}

export interface RequestState {
  requests: ExecutingRequest[]
}
