"use client";

import { rpc } from "@/server/typedEndpoints";
import { SignatureAtlasService } from "@grpc/atlas_connect";
import { Greeter } from "@grpc/helloworld_connect";
import { useEffect, useState } from "react";

const client = rpc(Greeter);
const sigAtlas = rpc(SignatureAtlasService);

export default function Dev() {
  const [t, setT] = useState<string | undefined>(undefined);

  useEffect(() => {
    client.sayHello({ name: "bla" }).then((e) => setT(e.message));
    sigAtlas.list({}).then(console.warn);
  }, []);

  return <div>{t}</div>;
}
