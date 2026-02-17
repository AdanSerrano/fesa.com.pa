"use client";

import { loginAction } from "@/modules/login/actions/login.actions";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useReducer, useTransition, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  LoginUser,
  LoginActionInput,
  createLoginFormSchema,
} from "../validations/schema/login.schema";

interface TwoFactorState {
  required: boolean;
  email: string | null;
  dialogOpen: boolean;
}

interface PendingDeletionState {
  isPending: boolean;
  email: string | null;
  scheduledDeletionDate: Date | null;
  daysRemaining: number | null;
  dialogOpen: boolean;
}

interface LoginState {
  error: string | null;
  twoFactor: TwoFactorState;
  pendingDeletion: PendingDeletionState;
  credentials: LoginActionInput | null;
}

type LoginAction =
  | { type: "CLEAR_ERROR" }
  | { type: "SET_ERROR"; error: string }
  | { type: "REQUIRE_TWO_FACTOR"; email: string; credentials: LoginActionInput }
  | { type: "CANCEL_TWO_FACTOR" }
  | { type: "CLOSE_TWO_FACTOR_DIALOG" }
  | { type: "OPEN_TWO_FACTOR_DIALOG" }
  | { type: "REQUIRE_PENDING_DELETION"; email: string; scheduledDeletionDate: Date | null; daysRemaining: number | null; credentials: LoginActionInput }
  | { type: "CLOSE_PENDING_DELETION_DIALOG" }
  | { type: "ACCOUNT_REACTIVATED" };

const initialLoginState: LoginState = {
  error: null,
  twoFactor: { required: false, email: null, dialogOpen: false },
  pendingDeletion: { isPending: false, email: null, scheduledDeletionDate: null, daysRemaining: null, dialogOpen: false },
  credentials: null,
};

function loginReducer(state: LoginState, action: LoginAction): LoginState {
  switch (action.type) {
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "REQUIRE_TWO_FACTOR":
      return {
        ...state,
        credentials: action.credentials,
        twoFactor: { required: true, email: action.email, dialogOpen: true },
      };
    case "CANCEL_TWO_FACTOR":
      return {
        ...state,
        twoFactor: { required: false, email: null, dialogOpen: false },
        credentials: null,
        error: null,
      };
    case "CLOSE_TWO_FACTOR_DIALOG":
      return { ...state, twoFactor: { ...state.twoFactor, dialogOpen: false } };
    case "OPEN_TWO_FACTOR_DIALOG":
      return { ...state, twoFactor: { ...state.twoFactor, dialogOpen: true } };
    case "REQUIRE_PENDING_DELETION":
      return {
        ...state,
        credentials: action.credentials,
        pendingDeletion: {
          isPending: true,
          email: action.email,
          scheduledDeletionDate: action.scheduledDeletionDate,
          daysRemaining: action.daysRemaining,
          dialogOpen: true,
        },
      };
    case "CLOSE_PENDING_DELETION_DIALOG":
      return { ...state, pendingDeletion: { ...state.pendingDeletion, dialogOpen: false } };
    case "ACCOUNT_REACTIVATED":
      return {
        ...state,
        pendingDeletion: { isPending: false, email: null, scheduledDeletionDate: null, daysRemaining: null, dialogOpen: false },
      };
  }
}

export const useLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [state, dispatch] = useReducer(loginReducer, initialLoginState);

  const sessionExpired = searchParams.get("sessionExpired") === "true";

  const form = useForm<LoginUser>({
    resolver: zodResolver(createLoginFormSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const login = useCallback(
    async (values: LoginUser) => {
      dispatch({ type: "CLEAR_ERROR" });
      startTransition(async () => {
        try {
          const actionInput: LoginActionInput = {
            ...values,
          };

          const result = await loginAction(actionInput);

          if (result?.error) {
            dispatch({ type: "SET_ERROR", error: result.error });
            toast.error(result.error);
            return;
          }

          if (result?.pendingDeletion && result?.email) {
            dispatch({
              type: "REQUIRE_PENDING_DELETION",
              email: result.email,
              scheduledDeletionDate: result.scheduledDeletionDate || null,
              daysRemaining: result.daysRemaining ?? null,
              credentials: actionInput,
            });
            return;
          }

          if (result?.requiresTwoFactor && result?.email) {
            dispatch({
              type: "REQUIRE_TWO_FACTOR",
              email: result.email,
              credentials: actionInput,
            });
            toast.success("Código de verificación enviado a tu correo");
            return;
          }

          if (result?.success) {
            toast.success(result.success);
            const callbackUrl =
              searchParams.get("callbackUrl") || DEFAULT_LOGIN_REDIRECT;
            router.push(callbackUrl);
            router.refresh();
          }
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Error al iniciar sesión";
          dispatch({ type: "SET_ERROR", error: errorMessage });
          toast.error(errorMessage);
        }
      });
    },
    [router, searchParams]
  );

  const completeTwoFactorLogin = useCallback(async () => {
    if (!state.credentials) return;

    startTransition(async () => {
      try {
        const result = await loginAction(state.credentials!);

        if (result?.error) {
          dispatch({ type: "SET_ERROR", error: result.error });
          toast.error(result.error);
          return;
        }

        if (result?.success && !result?.requiresTwoFactor) {
          toast.success("Inicio de sesión exitoso");
          const callbackUrl =
            searchParams.get("callbackUrl") || DEFAULT_LOGIN_REDIRECT;
          router.push(callbackUrl);
          router.refresh();
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al iniciar sesión";
        dispatch({ type: "SET_ERROR", error: errorMessage });
        toast.error(errorMessage);
      }
    });
  }, [state.credentials, router, searchParams]);

  const cancelTwoFactor = useCallback(() => {
    dispatch({ type: "CANCEL_TWO_FACTOR" });
  }, []);

  const closeTwoFactorDialog = useCallback(() => {
    dispatch({ type: "CLOSE_TWO_FACTOR_DIALOG" });
  }, []);

  const openTwoFactorDialog = useCallback(() => {
    dispatch({ type: "OPEN_TWO_FACTOR_DIALOG" });
  }, []);

  const closePendingDeletionDialog = useCallback(() => {
    dispatch({ type: "CLOSE_PENDING_DELETION_DIALOG" });
  }, []);

  const onAccountReactivated = useCallback(() => {
    dispatch({ type: "ACCOUNT_REACTIVATED" });
    if (state.credentials) {
      login({
        identifier: state.credentials.identifier,
        password: state.credentials.password,
      });
    }
  }, [state.credentials, login]);

  return {
    login,
    isPending,
    error: state.error,
    form,
    twoFactor: state.twoFactor,
    pendingDeletion: state.pendingDeletion,
    sessionExpired,
    completeTwoFactorLogin,
    cancelTwoFactor,
    closeTwoFactorDialog,
    openTwoFactorDialog,
    closePendingDeletionDialog,
    onAccountReactivated,
  };
};
