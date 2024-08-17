import "./bootstrap";
import "../css/app.css";

import { createRoot, hydrateRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import MainLayout from './Layouts/MainLayout';

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) =>`${title} - ${appName}`,
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
        let page = pages[`./Pages/${name}.jsx`];
        page.default.layout = page.default.layout || ((page) =><MainLayout children={page} />);
        return page;
    },
    setup({ el, App, props }) {
        if (import.meta.env.DEV) {
            createRoot(el).render(<App {...props} />);
            return;
        }

        hydrateRoot(el, <App {...props} />);
    },
    progress: {
        color: "#4B5563",
    },
});

