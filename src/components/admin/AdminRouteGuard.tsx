import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AdminLoader } from "./AdminLoader";
import { clearStoredAdminToken, getStoredAdminToken, verifyStoredAdminToken } from "@/lib/adminAuth";

interface AdminRouteGuardProps {
    children: ReactNode;
}

export const AdminRouteGuard = ({ children }: AdminRouteGuardProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isChecking, setIsChecking] = useState(true);
    const [isAllowed, setIsAllowed] = useState(false);

    useEffect(() => {
        const verifyAccess = async () => {
            const token = getStoredAdminToken();
            if (!token) {
                const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
                navigate(`/admin/login?redirect=${redirect}`, { replace: true });
                setIsChecking(false);
                return;
            }

            try {
                const isValid = await verifyStoredAdminToken(token);
                if (isValid) {
                    setIsAllowed(true);
                } else {
                    clearStoredAdminToken();
                    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
                    navigate(`/admin/login?redirect=${redirect}`, { replace: true });
                }
            } catch (error) {
                clearStoredAdminToken();
                const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
                navigate(`/admin/login?redirect=${redirect}`, { replace: true });
            } finally {
                setIsChecking(false);
            }
        };

        verifyAccess();
    }, [location.pathname, location.search, navigate]);

    if (isChecking) return <AdminLoader />;
    if (!isAllowed) return null;
    return <>{children}</>;
};
