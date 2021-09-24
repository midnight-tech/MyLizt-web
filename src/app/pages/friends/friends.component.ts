import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PopUpComponent } from 'src/app/components/pop-up/pop-up.component';
import { search, UserInterface } from 'src/app/data/interfaces';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { FriendPaginationService } from 'src/app/services/pagination/friend-pagination.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss'],
})
export class FriendsComponent implements OnInit, OnDestroy {
  isActiveAdd = false;
  isActiveRemove = false;
  friends: {
    user: UserInterface;
    aniCount: number;
    serieCount: number;
    bookCount: number;
  }[] = [];
  id = new FormControl('');
  loading = false
  selectedId = ""
  update = true
  page: number = 1
  totalPage: number = 1
  @ViewChild("popUpFriends") popUpMenu?: PopUpComponent;

  constructor
    (
      actRoute: ActivatedRoute,
      public userService: UserService,
      private router: Router,
      private friendPagination: FriendPaginationService,
      private loadingService: LoadingService
    ) {
    actRoute.params.subscribe((value) => {
      this.page = Number.parseInt(value.page);
      loadingService.isLoading = true
      this.changePage().then(() => {
        loadingService.isLoading = false
      })
    });
  }
  ngOnDestroy(): void {
    this.friendPagination.clean()
  }

  ngOnInit() {
  }

  async copyToClipboard(friendId: string) {
    await navigator.clipboard.writeText(friendId)
    this.popUpMenu?.showPopUp("text copied to clipboard")
  }

  async changePage() {
    const response = await this.friendPagination.friendPagination(
      this.page
    )
    if (response.length == 11) {
      this.totalPage += 1;
    }
    this.friends = response
  }

  showAddFriends() {
    if (this.isActiveAdd) {
      this.id.setValue('');
    }
    this.isActiveAdd = !this.isActiveAdd;
  }

  sendFriendRquest() {
    let id: string = this.id.value
    this.userService.sendFriendRequest(id.toLowerCase().replace("#", "")).then((value) => {
      if (value) {
        this.showAddFriends()
        this.popUpMenu?.showPopUp("Friend request sended successfully")
      }
    });
  }

  removeFriend() {
    let id: string = this.id.value.toLowerCase().replace("#", "")
    if (id != this.selectedId) {
      return
    }
    if (!this.loading) {
      this.loading = true
      this.userService.removeFriend(id).then((value) => {
        if (value) {
          this.showRemoveFriends()
          this.router.navigate(['home'])
        }
        this.loading = false
      });
    }
  }

  showRemoveFriends(friendId?: string) {
    if (this.isActiveRemove) {
      this.id.setValue('');
      this.selectedId = ""
    }
    this.selectedId = friendId?.toLocaleLowerCase().replace("#", "")!
    this.isActiveRemove = !this.isActiveRemove;
  }

  redirectToFriendList(friendId: string, type: search) {
    this.router.navigate(['home', 'friend-list', friendId, type.toLowerCase(), 1]);
  }

}
