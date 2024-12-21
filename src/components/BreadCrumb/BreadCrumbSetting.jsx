'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import { House } from 'lucide-react';

export default function BreadCrumbSetting({ title }) {
    const pathname = usePathname();
    const pathSegments = pathname.split('/').filter((segment) => segment);

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    return (
        <Breadcrumb className="mb-[10px]">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <House className="h-[16px] 2xl:h-[18px]" />
                    <BreadcrumbLink href="/dashboard" className="text-[14px]">
                        Principal
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {pathSegments.map((segment, index) => (
                    <React.Fragment key={index}>
                        <BreadcrumbSeparator className="text-[14px]" />
                        <BreadcrumbItem>
                            {index === pathSegments.length - 1 ? (
                                <span className="text-[14px]">{capitalize(title)}</span>
                            ) : (
                                <Link
                                    href={`/${pathSegments.slice(0, index + 1).join('/')}`}
                                    className="text-[14px]"
                                >
                                    {capitalize(segment)}
                                </Link>
                            )}
                        </BreadcrumbItem>
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
