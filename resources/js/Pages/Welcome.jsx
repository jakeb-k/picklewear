import { Link, Head } from "@inertiajs/react";

export default function Welcome({ auth, laravelVersion, phpVersion }) {

    return (
        <div className="min-h-dvh bg-gray-200">
            <Head title="Welcome" />
            
            <div>
                This is the welcome page
            </div>
        </div>
    );
}
