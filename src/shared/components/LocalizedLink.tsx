import {
  Link as RouterLink,
  NavLink as RouterNavLink,
  Navigate as RouterNavigate,
  type LinkProps,
  type NavLinkProps,
  type NavigateProps,
  type To
} from "react-router-dom";
import { useSiteContent } from "../hooks/useSiteContent";
import { localizePath } from "../i18n/locale";

function localizeTo(to: To, language: ReturnType<typeof useSiteContent>["language"]): To {
  if (typeof to === "string") return localizePath(to, language);
  if (!to.pathname) return to;
  return { ...to, pathname: localizePath(to.pathname, language) };
}

export function LocalizedLink({ to, ...props }: LinkProps) {
  const { language } = useSiteContent();
  return <RouterLink to={localizeTo(to, language)} {...props} />;
}

export function LocalizedNavLink({ to, ...props }: NavLinkProps) {
  const { language } = useSiteContent();
  return <RouterNavLink to={localizeTo(to, language)} {...props} />;
}

export function LocalizedNavigate({ to, ...props }: NavigateProps) {
  const { language } = useSiteContent();
  return <RouterNavigate to={localizeTo(to, language)} {...props} />;
}
