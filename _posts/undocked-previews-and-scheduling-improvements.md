{{{
    "title": "Undocked previews and scheduling improvements",
    "date": "03-29-2017 19:40"
}}}

As part of the jsreport 1.6 release we are introducing some improvements for previewing reports and schedules management:

## Undocked previews

We've noticed that our users spend most of the time interacting with the template editor in studio, so it is reasonable that most users want the editor to cover much of the space in studio for the best experience while editing templates.

As you probably know, studio has the template editor on the left and a preview pane on the right, this is something that limits how much space the template editor can take, before the 1.6 release you can solve this by collapsing the preview pane to allow the template editor have more space, but unfortunately that only solves part of the problem because in order to see the preview again you have to uncollapse it and you can imagine how annoying it is to collapse and un-collapse the preview pane while editing and previewing a template.

Fortunately, as part of the 1.6 release we are allowing to undock the preview pane in another browser tab/window, so you can move, group, resize those previews at your will and do anything which fits more in your workflow, users with large screens or multiple monitors now have more liberty to improve its experience.

<br/>
![undocked-previews](undocked-previews.gif)

## Scheduling improvements

Managing schedules has always require you to introduce a raw cron expression, as you can imagine, this is not the best experience, the format of a cron expression is something easy to forget or easy to misunderstand if you don't have any feedback or help, to help with this we are adding a cron builder UI that hopefully will cover most of your use cases and if not you can still introduce a raw cron expression as before, and both ways now show a human readable representation of the cron expression so you will have more feedback about the expression that you are creating/editing.

We are also introducing a new button "Run now" in schedule editor, this button will allow you to test a schedule immediately without having to wait for the next run of the schedule.

<br/>
![scheduling-improvements](scheduling-improvements.gif)

Let us know what you think about these new features, we are hoping to introduce more improvements like this in the future, so keep in touch!
