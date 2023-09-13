const responses: Record<number, string> = {
  200: "Request successfull!",
  201: "Resource created!",
  401: "Request unauthorized!",
  404: "Resource not found!",
  500: "Internal server error!",
  400: "Request refused!",
};

export default function getResponse(status: number, data?: any) {
  return {
    status: status,
    message: responses[status],
    body: data,
  };
}
