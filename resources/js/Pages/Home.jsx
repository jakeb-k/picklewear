import { Link, Head } from "@inertiajs/react";

export default function Home({ auth, laravelVersion, phpVersion }) {

    return (
        <div className="w-full flex flex-col flex-grow bg-gray-200">
            <Head title="Welcome" />
            
            <div>
                This is the welcome page
            </div>
        </div>
    );
}
