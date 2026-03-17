import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea"
import { trpc } from "~/lib/trpc";
import { toast } from "sonner";

export const Route = createFileRoute("/_client/events/new")({
  component: CreateEventPage,
});

function CreateEventPage() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState<
    "physical" | "virtual" | "hybrid" | "other" | ""
  >("");
  const [physicalLocation, setPhysicalLocation] = useState("");
  const [virtualUrl, setVirtualUrl] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [maxAttendees, setMaxAttendees] = useState("");
  const [category, setCategory] = useState("");

  const createEvent = trpc.events.create.useMutation({
    onSuccess: (data) => {
      toast.success("Event created successfully");
      utils.events.list.invalidate();
      navigate({ to: "/events/$id", params: { id: data.id } });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create event");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!startsAt) {
      toast.error("Start date and time are required");
      return;
    }

    if (!endsAt) {
      toast.error("End date and time are required");
      return;
    }

    if (new Date(endsAt) <= new Date(startsAt)) {
      toast.error("End time must be after start time");
      return;
    }

    if (eventType === "physical" && !physicalLocation.trim()) {
      toast.error("Physical location is required for physical events");
      return;
    }

    if (
      (eventType === "virtual" || eventType === "hybrid") &&
      !virtualUrl.trim()
    ) {
      toast.error("Virtual URL is required for virtual/hybrid events");
      return;
    }

    // Adjusting payload based on what the TRPC router expects. Assuming `category` and `visibility` can be mapped.
    createEvent.mutate({
      title: title.trim(),
      description: description || undefined,
      eventType: (eventType || "other") as "physical" | "virtual" | "hybrid" | "other",
      physicalLocation: physicalLocation.trim() || undefined,
      virtualUrl: virtualUrl.trim() || undefined,
      startsAt: new Date(startsAt),
      endsAt: new Date(endsAt),
      maxAttendees: maxAttendees ? parseInt(maxAttendees) : undefined,
      // If category needs mapping to trpc, ensure backend supports it, else omit or handle differently
      // visibility: 'public'
    });
  };

  const isVirtual = eventType === 'virtual'
  const isPhysical = eventType === 'physical'
  const isHybrid = eventType === 'hybrid'

  return (
    <div className="container mx-auto max-w-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Create Event</h1>
        <Button variant="outline" asChild>
          <Link to="/events">Cancel</Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={createEvent.isPending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            disabled={createEvent.isPending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="eventType">Event type</Label>
          <Select
            value={eventType}
            onValueChange={(value: any) => setEventType(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="physical">Physical</SelectItem>
              <SelectItem value="virtual">Virtual</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(isPhysical || isHybrid) && (
          <div className="space-y-2">
            <Label htmlFor="physicalLocation">Physical location (address)</Label>
            <Input
              id="physicalLocation"
              value={physicalLocation}
              onChange={(e) => setPhysicalLocation(e.target.value)}
              disabled={createEvent.isPending}
            />
          </div>
        )}

        {(isVirtual || isHybrid) && (
          <div className="space-y-2">
            <Label htmlFor="virtualUrl">Virtual URL (Zoom, Meet, etc.)</Label>
            <Input
              id="virtualUrl"
              type="url"
              value={virtualUrl}
              onChange={(e) => setVirtualUrl(e.target.value)}
              placeholder="https://..."
              disabled={createEvent.isPending}
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="startsAt">Starts at</Label>
            <Input
              id="startsAt"
              type="datetime-local"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
              disabled={createEvent.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endsAt">Ends at</Label>
            <Input
              id="endsAt"
              type="datetime-local"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
              disabled={createEvent.isPending}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="maxAttendees">Max attendees (optional)</Label>
            <Input
              id="maxAttendees"
              type="number"
              min="1"
              value={maxAttendees}
              onChange={(e) => setMaxAttendees(e.target.value)}
              disabled={createEvent.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category (optional)</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={createEvent.isPending}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link to="/events">
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
          <Button type="submit" disabled={createEvent.isPending}>
            {createEvent.isPending ? 'Creating...' : 'Create event'}
          </Button>
        </div>
      </form>
    </div>
  );
}
