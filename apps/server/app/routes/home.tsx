import type { MetaDescriptor } from 'react-router';
import { StarIcon } from 'lucide-react';

import type { AppService } from 'src/services';
import { XLogoIcon } from 'app/components/logos/X';

import type { Route } from './+types/home';

export function meta() {
    return [
        { title: 'React Router 7 + NestJS Custom Server • cbnsndwch OSS' }
    ] satisfies MetaDescriptor[];
}

export async function loader({ context }: LoaderFunctionArgs) {
    const appService = context.app.get<AppService>('AppService');

    return {
        hello: appService.getHello()
    };
}

export default function Home({ loaderData }: Route.ComponentProps) {
    const { hello } = loaderData;
    // const user = useOptionalUser();

    return (
        <main className="relative min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 max-w-3xl w-full text-gray-800">
                <h1 className="text-center text-4xl font-extrabold tracking-tight text-indigo-600 sm:text-5xl lg:text-6xl mb-6">
                    <span className="block drop-shadow-sm">{hello}</span>
                </h1>

                <p className="text-lg text-center mb-8">
                    Welcome to the{' '}
                    <code className="bg-gray-100 p-1 rounded text-indigo-700">
                        react-router-nest
                    </code>{' '}
                    template! This repository demonstrates how to integrate{' '}
                    <a
                        href="https://reactrouter.com/en/main"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium underline"
                    >
                        React Router 7
                    </a>{' '}
                    with a{' '}
                    <a
                        href="https://nestjs.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:text-red-800 font-medium underline"
                    >
                        NestJS
                    </a>{' '}
                    backend, leveraging server-side rendering (SSR)
                    capabilities.
                </p>

                <div className="space-y-4 mb-8">
                    <h2 className="text-2xl font-semibold text-gray-700">
                        Key Integration Points:
                    </h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>
                            <strong>NestJS Custom Server:</strong> We use
                            NestJS's ability to serve static assets and handle
                            dynamic requests. See the{' '}
                            <a
                                href="https://docs.nestjs.com/faq/http-adapter#use-another-http-server-instance"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-red-600 hover:text-red-800 underline"
                            >
                                NestJS HTTP Adapter docs
                            </a>{' '}
                            for more on custom server setups.
                        </li>
                        <li>
                            <strong>React Router Server Rendering:</strong>{' '}
                            Integration relies on React Router's SSR APIs like{' '}
                            <code className="bg-gray-100 p-1 rounded text-sm">
                                createStaticHandler
                            </code>{' '}
                            and{' '}
                            <code className="bg-gray-100 p-1 rounded text-sm">
                                createStaticRouter
                            </code>
                            . Explore the{' '}
                            <a
                                href="https://reactrouter.com/en/main/guides/ssr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline"
                            >
                                React Router SSR Guide
                            </a>
                            .
                        </li>
                        <li>
                            <strong>Vite Integration:</strong> The frontend
                            assets are built and served using Vite, configured
                            within the NestJS application.
                        </li>
                    </ul>
                </div>

                <div className="text-center space-y-4">
                    <p className="text-lg font-medium">
                        Enjoying the template?
                    </p>
                    <div className="flex justify-center space-x-4">
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://github.com/cbnsndwch/react-router-nest" // Replace with actual repo URL if different
                            className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            <StarIcon className="size-5 text-amber-500 fill-amber-500" />
                            Star on GitHub
                        </a>
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://twitter.com/intent/tweet?text=Checking%20out%20this%20cool%20React%20Router%20%2B%20NestJS%20template%20by%20%40cbnsndwch!%0A%0Ahttps%3A%2F%2Fgithub.com%2Fcbnsndwch%2Freact-router-nest"
                            className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            <XLogoIcon className="size-5" />
                            Shout out @cbnsndwch on X
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}
