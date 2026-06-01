import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

export function PlanTabs() {
  return (
    <Tabs defaultValue="book" className="w-full max-w-4xl mx-auto">
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="book">The Free Book</TabsTrigger>
        <TabsTrigger value="custom">Custom Plan</TabsTrigger>
      </TabsList>
      
      <TabsContent value="book" className="mt-0">
        <Card className="flex flex-col border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="text-3xl font-black">The Curriculum</CardTitle>
            <CardDescription className="text-base mt-2">
              Everything you need to build an effective training program — the
              science, the rationale, and the practical application. Read it,
              understand it, apply it yourself.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-6">
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"></path></svg>
                <span className="font-medium text-foreground">Full evidence-based curriculum</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"></path></svg>
                <span className="font-medium text-foreground">100+ pages, fully searchable</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"></path></svg>
                <span className="font-medium text-foreground">Chapter exercises and frameworks</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"></path></svg>
                <span className="font-medium text-foreground">No account or credit card required</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="bg-muted/20 border-t p-6">
            <a href="/introduction/state-of-industry/" className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
              Start reading — it's free <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
            </a>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="custom" className="mt-0">
        <Card className="flex flex-col border-primary/30 relative overflow-hidden bg-primary/5 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 p-6">
            <Badge variant="default" className="font-bold tracking-widest uppercase text-[0.65rem] shadow-sm">Available Now</Badge>
          </div>
          <CardHeader className="pb-4">
            <CardTitle className="text-3xl font-black">Done-For-You</CardTitle>
            <CardDescription className="text-base mt-2 max-w-[85%]">
              For people who just want to show up and lift. No reading required
              — I'll handle the program design based on your goals, schedule,
              equipment, and training history.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-6">
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"></path></svg>
                <span className="font-medium text-foreground">Fully personalized mesocycle</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"></path></svg>
                <span className="font-medium text-foreground">Exercise selection matched to your biomechanics</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"></path></svg>
                <span className="font-medium text-foreground">Volume & progression laid out week-by-week</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"></path></svg>
                <span className="font-medium text-foreground">One-time delivery, no recurring subscription</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="bg-primary/10 border-t border-primary/10 p-6">
            <a href="/custom-plans" className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
              Get Your Custom Plan <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
            </a>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
