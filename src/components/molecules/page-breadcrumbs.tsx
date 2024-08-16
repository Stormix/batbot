import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

interface PageBreadcrumbsProps {
  path: string[];
}

const PageBreadcrumbs = ({ path }: PageBreadcrumbsProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbLink href={`/`}>Home</BreadcrumbLink>
        <BreadcrumbSeparator />
        {path.map((item, index) => (
          <BreadcrumbItem key={index}>
            <BreadcrumbLink className="capitalize" href={`/${item}`}>
              {index === path.length - 1 ? <BreadcrumbPage>{item}</BreadcrumbPage> : item}
            </BreadcrumbLink>
            {index < path.length - 1 && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default PageBreadcrumbs;
