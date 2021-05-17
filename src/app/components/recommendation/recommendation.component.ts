import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { search, UserInterface } from 'src/app/data/interfaces';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ListService } from 'src/app/services/list/list.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.scss'],
})
export class RecommendationComponent implements OnInit {
  @Input() isActiveRecommend = false;
  @Input() type!: search
  @Input() contentId!: string
  @Input() contentName!: string
  @Output() isActiveEvent = new EventEmitter<boolean>();

  friends?: UserInterface[]

  constructor(
    private listService: ListService,
    private userService: UserService,
    private userAuth: AuthenticationService
  ) { }

  ngOnInit() {
    this.listFriends()
  }

  showRecommendation() {
    this.isActiveRecommend = !this.isActiveRecommend;
  }

  listFriends() {
    this.friends = []
    this.userService.getFriend().then((value) => {
      value.map(async (user) => {
        let response = await this.listService.contentInMyList(this.contentId, this.type, user.myList)
        if (!response.exists) {
          this.friends?.push(user)
        } else {
          const content = response.data()!
          if (content.recommended == null) {
            this.friends?.push(user)
            return
          }
          const myUser = this.userAuth.user?.uid
          for (let recommended of content.recommended) {
            if (recommended.id == myUser) {
              return
            }
          }
          this.friends?.push(user)
        }

      })
    })
  }

  disableRecommendation() {
    this.isActiveEvent.emit(false);
  }

  recommend(userId: string) {
    const copy = this.friends
    this.friends = []
    this.listService.recomendContent(this.contentId, this.contentName, userId, this.type).then((value) => {
      if (value == true) {
        this.listFriends()
      } else {
        this.friends = copy
      }
    })
  }
}
