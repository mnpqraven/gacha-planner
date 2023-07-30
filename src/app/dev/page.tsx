"use client";

import { createPromiseClient } from "@bufbuild/connect";
import { createGrpcWebTransport } from "@bufbuild/connect-web";
import { Greeter } from "@grpc/helloworld_connect";
import { useEffect, useState } from "react";

const client = createPromiseClient(
  Greeter,
  // has to use GrpcWebTransport, backend using tonic does not support
  // arbitrary protocols
  // https://docs.rs/tonic-web/latest/tonic_web/
  createGrpcWebTransport({
    baseUrl: "http://127.0.0.1:5005/rpc",
  })
);

export default function Dev() {
  const [t, setT] = useState<string | undefined>(undefined);

  useEffect(() => {
    client.sayHello({ name: "bla" }).then((e) => setT(e.message));
  }, []);

  return <div>{t}</div>;
}
