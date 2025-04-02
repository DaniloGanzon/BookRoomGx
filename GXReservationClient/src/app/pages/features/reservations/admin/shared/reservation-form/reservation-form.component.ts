import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ReservationService } from '../../../../../../services/features/reservation.service';
import { RoomService } from '../../../../../../services/features/room.service';
import { Reservation } from '../../../../../../model/Reservation';
import { Room } from '../../../../../../model/Room';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css']
})
export class ReservationFormComponent implements OnInit {
  @Input() roomId: number | null = null;
  @ViewChild('reservationForm') reservationForm!: NgForm;
  rooms: Room[] = [];
  selectedRoom: Room | null = null;

  reservation: any = {
    name: '',
    purpose: '',
    roomId: 0,
    startDate: this.getTodayDateString(), // YYYY-MM-DD format
    endDate: this.getTodayDateString(),   // YYYY-MM-DD format
    timeStart: '08:00', // HH:MM format
    durationHours: 1     // Simple number of hours
  };

  calculatedEndTime: string = '';
  spansMidnight: boolean = false;
  minDate: string;

  constructor(
    private reservationService: ReservationService,
    private roomService: RoomService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.minDate = this.getTodayDateString();
  }

  private getTodayDateString(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const roomId = params['roomId'];
      this.loadRooms(roomId);
    });
    this.updateCalculatedTimes();
  }

  loadRooms(roomId?: number): void {
    this.roomService.getAllRooms().subscribe({
      next: (rooms: Room[]) => {
        this.rooms = rooms;
        if (roomId) {
          const room = rooms.find(r => r.id === +roomId);
          if (room) {
            this.selectedRoom = room;
            this.reservation.roomId = room.id;
          }
        }
      },
      error: (error) => {
        console.error('Error loading rooms:', error);
        this.toastr.error('Failed to load rooms', 'Error');
      }
    });
  }

  onTimeOrDurationChange(): void {
    this.updateCalculatedTimes();
  }

  onStartDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.reservation.startDate = input.value;

    if (new Date(this.reservation.startDate) > new Date(this.reservation.endDate)) {
      this.reservation.endDate = this.reservation.startDate;
    }
    this.updateCalculatedTimes();
  }

  onEndDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.reservation.endDate = input.value;
  }

  private updateCalculatedTimes(): void {
    if (this.reservation.timeStart && this.reservation.durationHours) {
      const [hours, minutes] = this.reservation.timeStart.split(':').map(Number);
      const durationHours = parseInt(this.reservation.durationHours, 10);

      let endHours = hours + durationHours;
      this.spansMidnight = endHours >= 24;

      if (this.spansMidnight) {
        endHours -= 24;
        const startDate = new Date(this.reservation.startDate);
        const nextDay = new Date(startDate);
        nextDay.setDate(startDate.getDate() + 1);
        this.reservation.endDate = nextDay.toISOString().split('T')[0];
      }

      this.calculatedEndTime = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
  }

  datesValid(): boolean {
    return new Date(this.reservation.startDate) <= new Date(this.reservation.endDate);
  }

  isDateInPast(dateString: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dateString) < today;
  }

  onSubmit(): void {
    if (!this.reservationForm.form.valid) {
      this.toastr.error('Please fill all required fields correctly', 'Form Error');
      return;
    }

    this.reservationService.createReservation(this.reservation).subscribe({
      next: () => {
        this.toastr.success('Reservation created successfully!', 'Success');
        this.router.navigate(['/admin/rooms/calendar/id']);
      },
      error: (error) => {
        console.error('Error creating reservation:', error);
        this.toastr.error('Failed to create reservation', 'Error');
      }
    });
  }
}