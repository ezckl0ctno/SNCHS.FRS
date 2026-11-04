import { useEffect, useRef, useState, type ReactNode } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useRouterState } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { loadSharedSchoolState, saveSharedSchoolState, sharedSchoolSnapshot } from "@/lib/school/shared-state";
import { emptyNotify } from "@/lib/school/seed";
import { useSchool } from "@/lib/school/store";

export function SchoolWorkspace({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  const userId = user?.id;
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState("");
  const activeUserId = useRef<string | null>(null);

  useEffect(() => {
    if (isPending || !userId || pathname === "/login") {
      activeUserId.current = null;
      setLoadedUserId(null);
      setLoadError("");
      return;
    }
    if (activeUserId.current === userId) return;
    activeUserId.current = userId;
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let lastSnapshot = "";

    void (async () => {
      try {
        const remote = await loadSharedSchoolState();
        if (cancelled) return;
        if (remote) {
          useSchool.setState((current) => {
            const localDescriptors = new Map(current.students.map((student) => [student.id, student.descriptors]));
            const merged = {
              ...current,
              school: {
                ...current.school,
                ...remote.school,
                notify: { ...emptyNotify(), ...remote.school?.notify },
              },
              sections: remote.sections ?? current.sections,
              students: (remote.students ?? []).map((student) => ({
                ...student,
                descriptors: localDescriptors.get(student.id) ?? [],
              })),
              parents: remote.parents ?? current.parents,
              attendance: remote.attendance ?? current.attendance,
              alerts: remote.alerts ?? current.alerts,
            };
            return merged;
          });
        }
        const initial = sharedSchoolSnapshot(useSchool.getState());
        lastSnapshot = JSON.stringify(initial);
        if (!remote) await saveSharedSchoolState({ data: { state: initial } });
        if (cancelled) return;
        unsubscribe = useSchool.subscribe((state) => {
          const snapshot = sharedSchoolSnapshot(state);
          const serialized = JSON.stringify(snapshot);
          if (serialized === lastSnapshot) return;
          lastSnapshot = serialized;
          if (timer) clearTimeout(timer);
          timer = setTimeout(() => {
            void saveSharedSchoolState({ data: { state: snapshot } }).catch((error: unknown) => {
              if (!cancelled) setLoadError(error instanceof Error ? error.message : "School data could not be synchronized.");
            });
          }, 500);
        });
        setLoadedUserId(userId);
      } catch (error) {
        if (cancelled) return;
        activeUserId.current = null;
        setLoadError(error instanceof Error ? error.message : "Shared school data could not be loaded.");
      }
    })();

    return () => {
      cancelled = true;
      unsubscribe?.();
      if (timer) clearTimeout(timer);
    };
  }, [isPending, pathname, userId]);

  if (pathname === "/login") return children;
  if (isPending) return <WorkspaceMessage>Checking your school account…</WorkspaceMessage>;
  if (!userId) return <RedirectToSignIn />;
  if (loadError) {
    return (
      <WorkspaceMessage>
        <p className="font-medium text-rose">Could not securely load the shared school records.</p>
        <p className="mt-2 text-sm text-muted">{loadError}</p>
        <Button className="mt-4" variant="outline" onClick={() => window.location.reload()}>Try again</Button>
      </WorkspaceMessage>
    );
  }
  if (loadedUserId !== userId) return <WorkspaceMessage>Loading shared school records…</WorkspaceMessage>;
  return children;
}

function WorkspaceMessage({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-svh place-items-center bg-canvas p-6 text-center">
      <div className="max-w-lg rounded-3xl bg-paper p-7 shadow-border">{children}</div>
    </main>
  );
}
