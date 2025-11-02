import { useChangeUserPreferencesCommandHandler } from "@guitos/hooks/useChangeUserPreferencesCommandHandler";
import { useReadUserPreferencesQueryHandler } from "@guitos/hooks/useReadUserPreferencesQueryHandler";

export function useRegisterHandlers() {
  // commands
  useChangeUserPreferencesCommandHandler();
  // events
  // queries
  useReadUserPreferencesQueryHandler();
}
