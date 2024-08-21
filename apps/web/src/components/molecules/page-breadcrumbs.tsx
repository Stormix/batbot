import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Fragment } from 'react';

interface PageBreadcrumbsProps {
  path: string[];
}

const PageBreadcrumbs = ({ path }: PageBreadcrumbsProps) => {
  // TODO: refine component
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbLink href={`/`}>Home</BreadcrumbLink>
        <BreadcrumbSeparator />
        {path.map((item, index) => (
          <Fragment key={index}>
            <BreadcrumbLink className="capitalize" href={`/${item}`}>
              {index === path.length - 1 ? <BreadcrumbPage>{item}</BreadcrumbPage> : item}
            </BreadcrumbLink>
            {index < path.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default PageBreadcrumbs;
