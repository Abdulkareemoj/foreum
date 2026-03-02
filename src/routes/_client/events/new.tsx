import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { RichTextEditor } from "~/components/ui/rich-text-editor";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { trpc } from "~/lib/trpc";
import { toast } from "sonner";
import { ArrowLeft, Calendar } from "lucide-react";
import { Textarea } from "~/components/ui/textarea";

export const Route = createFileRoute("/_client/events/new")({
  component: CreateEventPage,
});

function CreateEventPage() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState<
    "physical" | "virtual" | "hybrid" | "other"
  >("physical");
  const [physicalLocation, setPhysicalLocation] = useState("");
  const [virtualUrl, setVirtualUrl] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [maxAttendees, setMaxAttendees] = useState("");
  const [visibility, setVisibility] = useState<
    "public" | "private" | "unlisted"
  >("public");

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

    createEvent.mutate({
      title: title.trim(),
      description: description || undefined,
      eventType,
      physicalLocation: physicalLocation.trim() || undefined,
      virtualUrl: virtualUrl.trim() || undefined,
      startsAt: new Date(startsAt),
      endsAt: new Date(endsAt),
      maxAttendees: maxAttendees ? parseInt(maxAttendees) : undefined,
      visibility,
    });
  };

  return (
    <div className="container max-w-2xl py-6 space-y-6">
      <Button variant="ghost" onClick={() => navigate({ to: "/events" })}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Events
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Create New Event
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter event title"
                disabled={createEvent.isPending}
                maxLength={200}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <RichTextEditor
                id="description"
                value={description}
                onChange={setDescription}
                placeholder="Describe your event..."
                disabled={createEvent.isPending}
                showCharacterCount={true}
                maxLength={1000}
              />
            </div>

            {/* Event Type */}
            <div className="space-y-2">
              <Label htmlFor="eventType">Event Type *</Label>
              <Select
                value={eventType}
                onValueChange={(value: any) => setEventType(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physical">Physical (In-person)</SelectItem>
                  <SelectItem value="virtual">Virtual (Online)</SelectItem>
                  <SelectItem value="hybrid">Hybrid (Both)</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Physical Location */}
            {(eventType === "physical" || eventType === "hybrid") && (
              <div className="space-y-2">
                <Label htmlFor="location">Physical Location *</Label>
                <Input
                  id="location"
                  value={physicalLocation}
                  onChange={(e) => setPhysicalLocation(e.target.value)}
                  placeholder="123 Main St, City, State"
                  disabled={createEvent.isPending}
                />
              </div>
            )}

            {/* Virtual URL */}
            {(eventType === "virtual" || eventType === "hybrid") && (
              <div className="space-y-2">
                <Label htmlFor="virtualUrl">Virtual Meeting URL *</Label>
                <Input
                  id="virtualUrl"
                  type="url"
                  value={virtualUrl}
                  onChange={(e) => setVirtualUrl(e.target.value)}
                  placeholder="https://zoom.us/j/..."
                  disabled={createEvent.isPending}
                />
              </div>
            )}

            {/* Start Date & Time */}
            <div className="space-y-2">
              <Label htmlFor="startsAt">Start Date & Time *</Label>
              <Input
                id="startsAt"
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                disabled={createEvent.isPending}
              />
            </div>

            {/* End Date & Time */}
            <div className="space-y-2">
              <Label htmlFor="endsAt">End Date & Time *</Label>
              <Input
                id="endsAt"
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                disabled={createEvent.isPending}
              />
            </div>

            {/* Max Attendees */}
            <div className="space-y-2">
              <Label htmlFor="maxAttendees">Maximum Attendees (optional)</Label>
              <Input
                id="maxAttendees"
                type="number"
                min="1"
                value={maxAttendees}
                onChange={(e) => setMaxAttendees(e.target.value)}
                placeholder="Leave empty for unlimited"
                disabled={createEvent.isPending}
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
