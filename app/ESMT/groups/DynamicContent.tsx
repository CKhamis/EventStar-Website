'use client'
import AlertList, {alertContent} from "@/components/AlertList";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";
import {Group} from "@prisma/client";
import {GroupTable} from "@/app/ESMT/groups/GroupTable";

export default function DynamicContent(){
    const [groups, setGroups] = useState<Group[]>([]);
    const [alertMessages, setAlertMessages] = useState<alertContent[]>([]);

    const fetchGroups = async () => {
        try {
            const response = await axios.get("/api/esmt/groups/all");
            setGroups(response.data);
        } catch (err) {
            console.error("Error fetching users:", err);
            setAlertMessages([...alertMessages, { title: "Catastrophic Error", message: "Unable to fetch list of groups", icon: 2 }]);
        }
    };

    // async function editGroup(id: string){
    //     try {
    //         console.log(id);
    //         await axios.post("/api/esmt/groups/edit", {id: id}).finally(refresh);
    //     } catch (err) {
    //         console.error("Error fetching users:", err);
    //         setAlertMessages([...alertMessages, { title: "Catastrophic Error", message: "Unable to edit group", icon: 2 }]);
    //     }
    // }

    async function deleteGroup(id: string){
        try {
            console.log(id);
            await axios.post("/api/esmt/groups/delete", {id: id}).finally(refresh);
        } catch (err) {
            console.error("Error fetching users:", err);
            setAlertMessages([...alertMessages, { title: "Catastrophic Error", message: "Unable to fetch list of groups", icon: 2 }]);
        }
    }

    function refresh(){
        fetchGroups();
    }

    useEffect(() => {
        refresh();
    }, []);

    return (
        <div className="container mt-4">
            <AlertList alerts={alertMessages}/>
            <div className="flex justify-between gap-4 mb-4">
                <h1 className="text-3xl">User Groups</h1>
                <Link href="/ESMT/groups/new">
                    <Button variant="secondary">+ New Group</Button>
                </Link>
            </div>
            <GroupTable data={groups} deleteGroup={deleteGroup} />
        </div>
    );
}