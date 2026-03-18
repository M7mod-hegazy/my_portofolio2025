import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useRef } from 'react';

interface ModalContextType {
    activeProjectId: string | null;
    activeCertId: string | null;
    openProject: (id: string) => void;
    closeProject: () => void;
    openCert: (id: string) => void;
    closeCert: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
    const [activeCertId, setActiveCertId] = useState<string | null>(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const modalOpenedViaPushRef = useRef(false);

    const syncFromUrl = useCallback(() => {
        const params = new URLSearchParams(window.location.search);
        const projectId = params.get('project');
        const certificateId = params.get('certificate');
        
        if (projectId) {
            setActiveProjectId(projectId);
            setActiveCertId(null);
            return;
        }
        if (certificateId) {
            setActiveCertId(certificateId);
            setActiveProjectId(null);
            return;
        }
        setActiveProjectId(null);
        setActiveCertId(null);
    }, []);

    const updateUrlForModal = useCallback((key: 'project' | 'certificate', id: string, mode: 'push' | 'replace' = 'push') => {
        const url = new URL(window.location.href);
        url.searchParams.delete('project');
        url.searchParams.delete('certificate');
        url.searchParams.set(key, id);
        const state = { ...(window.history.state || {}), portfolioModal: true, modalType: key, modalId: id };
        if (mode === 'push') {
            window.history.pushState(state, '', `${url.pathname}${url.search}${url.hash}`);
        } else {
            window.history.replaceState(state, '', `${url.pathname}${url.search}${url.hash}`);
        }
    }, []);

    const clearModalFromUrl = useCallback((mode: 'replace' | 'push' = 'replace') => {
        const url = new URL(window.location.href);
        url.searchParams.delete('project');
        url.searchParams.delete('certificate');
        const state = { ...(window.history.state || {}), portfolioModal: false, modalType: null, modalId: null };
        if (mode === 'push') {
            window.history.pushState(state, '', `${url.pathname}${url.search}${url.hash}`);
        } else {
            window.history.replaceState(state, '', `${url.pathname}${url.search}${url.hash}`);
        }
    }, []);

    useEffect(() => {
        syncFromUrl();
        // Delay setting isInitialLoad to false to give sections time to mount
        const timer = setTimeout(() => setIsInitialLoad(false), 1000);
        const handlePopState = () => {
            modalOpenedViaPushRef.current = false;
            syncFromUrl();
        };
        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
            clearTimeout(timer);
        };
    }, [syncFromUrl]);

    const openProject = (id: string) => {
        modalOpenedViaPushRef.current = true;
        setActiveProjectId(id);
        setActiveCertId(null);
        updateUrlForModal('project', id, 'push');
    };

    const closeProject = () => {
        setActiveProjectId(null);
        clearModalFromUrl('replace');
    };

    const openCert = (id: string) => {
        modalOpenedViaPushRef.current = true;
        setActiveCertId(id);
        setActiveProjectId(null);
        updateUrlForModal('certificate', id, 'push');
    };

    const closeCert = () => {
        setActiveCertId(null);
        if (modalOpenedViaPushRef.current && window.history.length > 1) {
            modalOpenedViaPushRef.current = false;
            window.history.back();
            return;
        }
        clearModalFromUrl('replace');
    };

    return (
        <ModalContext.Provider value={{
            activeProjectId,
            activeCertId,
            openProject,
            closeProject,
            openCert,
            closeCert
        }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};
