import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { content } from 'src/app/data/interfaces';
import { ListService } from 'src/app/services/list/list.service';

@Component({
  selector: 'app-content-completed',
  templateUrl: './content-completed.component.html',
  styleUrls: ['./content-completed.component.scss'],
})
export class ContentCompletedComponent implements OnInit {
  @Input() isActiveCompleted = false;
  @Input() content?: content;
  @Output() isActiveEvent = new EventEmitter<boolean>();
  @Output() contentAlter = new EventEmitter<content>();

  constructor(
    private listService: ListService
  ) { }

  ngOnInit() { }

  changeWhatched(watched: boolean) {
    if (this.content == undefined) {
      throw "content is undefined"
    }
    if (this.content.watched == watched) {
      this.changeActiveCompleted()
      return
    }
    this.content.watched = watched
    this.listService.editContent(this.content).then((value) => {
      this.changeActiveCompleted()
      this.contentAlter.emit(value)
    })
  }

  changeActiveCompleted() {
    this.isActiveEvent.emit(false);
  }
}
