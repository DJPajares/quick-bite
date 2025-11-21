import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{t('Home.title')}</h1>
          <p className="text-muted-foreground">
            Welcome to Quick Bite - your favorite food delivery app
          </p>
        </div>

        {/* Sample Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Orders</CardTitle>
              <CardDescription>Order your favorites in seconds</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">{t('Button.continue')}</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Popular Dishes</CardTitle>
              <CardDescription>Trending in your area</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full"
              >
                View Menu
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Special Offers</CardTitle>
              <CardDescription>Save on your next order</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="secondary"
                className="w-full"
              >
                See Deals
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
