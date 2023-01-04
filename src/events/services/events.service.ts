import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from '@nestjs/common';
import { Repository } from "typeorm";
import { Events } from "../event.entity";
import { CreatedEventDto } from "../dto/events.dto";
import * as dayjs from 'dayjs';
import { EventDto } from "../dto/event.dto";



@Injectable()
export class EventService {
    constructor(
        @InjectRepository(Events)
        private eventRepository: Repository<Events>,
    ) {}

    async GetAllEvents() {
        return await this.eventRepository.find();
    }

    async GetEvent(id: string) {
        return await this.eventRepository.findOne({ where: { id : id }});
    }

    async SameDay(id: string, date: Date) {
        let allEvents = await this.eventRepository.find({ where: {userId:id}});
        let sameday = false
        allEvents.forEach(event => {
            if (dayjs(event.date).isSame(date, 'day')) {
                sameday = true;
            }
        })
        return sameday;
    }

    async CheckSameWeek(id: string, date: Date) {
        let allEvents = await this.eventRepository.find({ where: {userId:id}});
        let sameWeek = 0
        allEvents.forEach(event => {
            if (dayjs(event.date).isSame(date, 'week')) {
                sameWeek += 1;
            }
        })
        if (sameWeek >= 2) return true
        return false
    }

    async CheckMeal(date: Date, id: string) {
        let allEvent = await this.eventRepository.find({ where: {userId:id}});
        let pass = false;
        allEvent.forEach(event => {
            if (dayjs(event.date).isSame(date, 'day')) {
                pass = true;
            }
        })
        if (pass) return true;
        return false;
    }

    async GetAllEventsForCsv() {
        let allEvents = await this.eventRepository.find({ where : { eventStatus: 'Accepted', eventType: 'PaidLeave' }});
        let allGoodEvents = [];
        allEvents.forEach(event => {
            // if (dayjs(event.date).isSame(new Date(), 'month')) {
                allGoodEvents.push(event);
            // }
        })
        return allGoodEvents; // allEvents;
    }



    Create(event: EventDto): Promise<Events> {
        const newEvent = this.eventRepository.create(event);
        return this.eventRepository.save(newEvent);
    }

    Update(event: Events) {
        return this.eventRepository.update(event.id, event);
    }
}