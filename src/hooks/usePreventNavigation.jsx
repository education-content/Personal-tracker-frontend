import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function usePreventBackNavigation(redirectTo = "/dashboard") {
  const navigate = useNavigate();

  useEffect(() => {
    // Prevent going back
    const handlePopState = () => {
      navigate(redirectTo, { replace: true });
    };

    // Push a dummy state
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate, redirectTo]);
}
