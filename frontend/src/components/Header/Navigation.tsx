import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '../ui/navigation-menu';
import { Link } from '@tanstack/react-router';

export default function HeaderNavigation({
  className,
}: {
  className?: string;
}) {
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList className="flex flex-col sm:flex-row">
        <NavigationMenuItem className="w-full sm:w-max">
          <NavigationMenuLink
            className="group inline-flex h-9 w-full sm:w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 cursor-pointer"
            asChild
          >
            <Link className="w-full sm:w-max" to="/">
              Food Entries
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem className="w-full sm:w-max">
          <NavigationMenuLink
            className="group inline-flex h-9 w-full sm:w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 cursor-pointer"
            asChild
          >
            <Link className="w-full sm:w-max" to="/meals">
              Meals
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
