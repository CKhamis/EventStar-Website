"use client"

import {LoadingIcon} from "@/components/LoadingIcon";
import {useEffect, useState} from "react";
import axios from "axios";
import {EventWithRsvp, EventWithRsvpWithUser} from "@/components/Types";
import Image from "next/image";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {format} from "date-fns";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import Attendance from "@/app/ESMT/calendar/attendance/[id]/tabs/Attendance";

export interface Props{
    eventId: string;
}

export default function UserInfo({eventId}: Props){
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState<EventWithRsvpWithUser | null>(null);

    const refresh = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/esmt/events/view/" + eventId)
            setEvent(response.data);
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, [])

    if (loading && event === null) {
        return (
            <LoadingIcon />
        );
    }

    if(event === null){
        return (
            <div className="w-100 h-full flex flex-col items-center justify-center p-10 top-left-gradient">
                <Image src="/agent/error.gif" alt="waiting" height={150} width={150} className="mb-5" />
                <p className="text-4xl font-bold text-center">OOPS! There was an error with the event</p>
                <p className="mt-3">The event may have been deleted</p>
                <Link href="/" className="underline text-muted-foreground mt-3">Back to home page</Link>
            </div>
        );
    }

    return (
        <div style={{background: event.backgroundStyle}} className="h-full">
            <div className="glass-dark h-full">
                <div className="container">
                    {loading ? <LoadingIcon/> : ""}
                    <div className="w-100 border-b flex flex-row justify-between py-5">
                        <div className="flex flex-row justify-start gap-5 items-center">
                            <div>
                                <p className="font-bold text-4xl">{event.title}</p>
                                <p className="mt-3 ml-1 text-muted-foreground">{event.eventType} | {format(event.eventStart, "MM/dd/yyyy h:mm a")}</p>
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="sm">Groups</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>All groups</DropdownMenuLabel>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <Tabs defaultValue="overview" className="w-100 mt-4">
                        <TabsList className="grid w-full grid-cols-4 mb-5">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="attendance">Attendance</TabsTrigger>
                            <TabsTrigger value="settings">Settings</TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview"></TabsContent>
                        <TabsContent value="details"></TabsContent>
                        <TabsContent value="attendance"><Attendance eventDetails={event} /></TabsContent>
                        <TabsContent value="settings"></TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}