import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import { House } from 'lucide-react';

export default function BreadCrumbSetting() {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <House className="h-[16px] 2xl:h-[18px]" />
                    <BreadcrumbLink href="/dashboard" className="text-[14px]">
                        Principal
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-[14px]" />
                <BreadcrumbItem>
                    <BreadcrumbLink href="/setting/users" className="text-[14px]">
                        Configuración
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
}
