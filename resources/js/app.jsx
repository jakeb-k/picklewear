import "./bootstrap";
import "../css/app.css";

import { createRoot, hydrateRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import MainLayout from './Layouts/MainLayout';
import MobileLayout from "./Layouts/MobileLayout";
import { HelmetProvider } from "react-helmet-async";

const appName = "Picklewear";
const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

createInertiaApp({
    title: (title) =>`${title} - ${appName}`,
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
        let page = pages[`./Pages/${name}.jsx`];
        page.default.layout = page.default.layout || ((page) =>
            isMobile
                ? <MobileLayout>{page}</MobileLayout>
                : <MainLayout>{page}</MainLayout>
        );
        return page;
    },
    setup({ el, App, props }) {
        if (import.meta.env.DEV) {
            createRoot(el).render(
                <HelmetProvider>
                    <App {...props} />
                </HelmetProvider>
            );
            return;
        }

        hydrateRoot(el, <App {...props} />);
    },
    progress: {
        color: "#4B5563",
    },
});

