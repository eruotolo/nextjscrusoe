'use client';

import { PropagateLoader } from 'react-spinners';

export default function Loading() {
    return (
        <>
            <div className="mt-[30px] flex items-center justify-center">
                <PropagateLoader color="#01E469" />
            </div>
        </>
    );
}
