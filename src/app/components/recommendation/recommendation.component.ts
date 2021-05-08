import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { search, UserInterface } from 'src/app/data/interfaces';
import { ListService } from 'src/app/services/list/list.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.scss'],
})
export class RecommendationComponent implements OnInit {
  @Input() isActiveRecommend = false;
  @Input() type! : search
  @Input() contentId! : string
  @Input() contentName!: string
  @Output() isActiveEvent = new EventEmitter<boolean>();

  friends? : UserInterface[]

  constructor(
    private listService : ListService,
    private userService : UserService
  ) {}

  ngOnInit() {
    this.userService.getFriend().then((value)=>{
      this.friends = value
    })
  }

  showRecommendation() {
    console.log("true")
    if(!this.isActiveRecommend){
      this.userService.getFriend().then((value)=>{
        this.friends = value
      })
    }
    this.isActiveRecommend = !this.isActiveRecommend;
  }

  disableRecommendation() {
    this.isActiveEvent.emit(false);
  }

  recommend(userId: string){
    this.listService.recomendContent(this.contentId,this.contentName,userId,this.type).then((value)=>{
      console.log(value)
    })
  }
}
