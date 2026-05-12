"use client";

import { useEffect, useState } from "react";
import { 
  AlertCircle, 
  AlertTriangle, 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight,
  Activity,
  Clock,
  RefreshCw
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Alert = {
  id: string;
  type: string;
  severity: "WARNING" | "DANGER";
  title: string;
  message: string;
  href: string;
  createdAt: string;
};

type Summary = {
  total: number;
  danger: number;
  warning: number;
};

export function AdminAlertsBlock() {
  return null;
}
