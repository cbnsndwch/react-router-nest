import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

import './index.css';

export async function loader() {
    return { user: { foo: 'bar' } };
}

export default function App() {
    return (
        <html lang="en" className="h-full">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body className="h-full">
                <Outlet />
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}
