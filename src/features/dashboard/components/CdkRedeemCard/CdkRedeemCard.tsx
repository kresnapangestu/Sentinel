"use client";

import { useState } from "react";
import { Card } from "@/components/atoms/Card";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { Typography } from "@/components/atoms/Typography";
import { Icon } from "../Icon";

/** "CDKELY" redeem-code card. Local-only input state, no submission wiring yet. */
export function CdkRedeemCard() {
  const [code, setCode] = useState("");

  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center justify-between">
        <Typography variant="h2" className="text-base">
          CDKELY
        </Typography>
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-sm bg-primary-soft text-primary">
          <Icon name="code" size={14} />
        </span>
      </div>
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Enter CDK"
          aria-label="Enter CDK code"
          className="h-10"
        />
        <Button size="sm" disabled={!code.trim()}>
          Redeem
        </Button>
      </div>
    </Card>
  );
}
