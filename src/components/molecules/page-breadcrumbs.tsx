import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

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
          <>
            <BreadcrumbLink key={index} className="capitalize" href={`/${item}`}>
              {index === path.length - 1 ? <BreadcrumbPage>{item}</BreadcrumbPage> : item}
            </BreadcrumbLink>
            {index < path.length - 1 && <BreadcrumbSeparator />}
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default PageBreadcrumbs;
