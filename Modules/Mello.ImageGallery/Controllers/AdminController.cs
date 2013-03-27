using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Mello.ImageGallery.Services;
using Mello.ImageGallery.ViewModels;
using Orchard;
using Orchard.Core.Contents.Controllers;
using Orchard.Localization;
using Orchard.UI.Notify;

namespace Mello.ImageGallery.Controllers {
    public class AdminController : Controller {
        private readonly IImageGalleryService _imageGalleryService;

        public AdminController(IOrchardServices services, IImageGalleryService imageGalleryService) {
            Services = services;
            _imageGalleryService = imageGalleryService;

            T = NullLocalizer.Instance;
        }

        public IOrchardServices Services { get; set; }
        public Localizer T { get; set; }

        [HttpGet]
        public ViewResult Index() {
            return View(new ImageGalleryIndexViewModel {ImageGalleries = _imageGalleryService.GetImageGalleries()});
        }

        [HttpGet]
        public ActionResult Create() {
            if (!Services.Authorizer.Authorize(Permissions.ManageImageGallery, T("Couldn't create image gallery"))) {
                return new HttpUnauthorizedResult();
            }

            return View(new CreateGalleryViewModel());
        }

        [HttpPost]
        public ActionResult Create(CreateGalleryViewModel addGalleryViewModel) {
            if (!Services.Authorizer.Authorize(Permissions.ManageImageGallery, T("Couldn't create image gallery"))) {
                return new HttpUnauthorizedResult();
            }
            if (!ModelState.IsValid) {
                return View(addGalleryViewModel);
            }

            try {
                _imageGalleryService.CreateImageGallery(addGalleryViewModel.GalleryName);

                Services.Notifier.Information(T("Image gallery created"));
                return RedirectToAction("Index");
            }
            catch (Exception exception) {
                Services.Notifier.Error(T("Creating image gallery failed: {0}", exception.Message));
                return View(addGalleryViewModel);
            }
        }

        [HttpGet]
        public ActionResult Images(string imageGalleryName) {
            if (!Services.Authorizer.Authorize(Permissions.ManageImageGallery, T("Cannot edit image gallery"))) {
                return new HttpUnauthorizedResult();
            }

            var imageGallery = _imageGalleryService.GetImageGallery(imageGalleryName);

            return View(new ImageGalleryImagesViewModel
                        {
                            ImageGalleryName = imageGallery.Name,
                            Images = imageGallery.Images
                        });
        }

        [HttpGet]
        public ActionResult EditProperties(string imageGalleryName) {
            if (!Services.Authorizer.Authorize(Permissions.ManageImageGallery, T("Cannot edit image gallery"))) {
                return new HttpUnauthorizedResult();
            }

            return View(new ImageGalleryEditPropertiesViewModel {ImageGallery = _imageGalleryService.GetImageGallery(imageGalleryName)});
        }

        [HttpPost]
        [FormValueRequired("submit.Save")]
        public ActionResult EditProperties(ImageGalleryEditPropertiesViewModel viewModel, string newName) {
            if (!Services.Authorizer.Authorize(Permissions.ManageImageGallery, T("Cannot edit image gallery"))) {
                return new HttpUnauthorizedResult();
            }

            if (!ModelState.IsValid) {
                return View(viewModel);
            }

            if (string.IsNullOrEmpty(newName)) {
                ModelState.AddModelError("NewName", T("Invalid image gallery name").ToString());
                return View(viewModel);
            }

            try {
                _imageGalleryService.UpdateImageGalleryProperties(viewModel.ImageGallery.Name, viewModel.ImageGallery.ThumbnailHeight,
                                                                  viewModel.ImageGallery.ThumbnailWidth, viewModel.ImageGallery.KeepAspectRatio);

                if (viewModel.ImageGallery.Name != newName) {
                    _imageGalleryService.RenameImageGallery(viewModel.ImageGallery.Name, newName);
                }

                Services.Notifier.Information(T("Image gallery properties successfully modified"));
                return RedirectToAction("Images", new {imageGalleryName = newName});
            }
            catch (Exception exception) {
                Services.Notifier.Error(T("Editing image gallery failed: {0}", exception.Message));
                return View(viewModel);
            }
        }

        [HttpGet]
        public ActionResult AddImages(string imageGalleryName) {
            if (!Services.Authorizer.Authorize(Permissions.ManageImageGallery, T("Cannot add images to image gallery"))) {
                return new HttpUnauthorizedResult();
            }

            return View(new ImageAddViewModel { AllowedFiles = _imageGalleryService.AllowedFileFormats, ImageGalleryName = imageGalleryName});
        }

        [HttpPost]
        public ActionResult AddImages(ImageAddViewModel viewModel) {
            if (!Services.Authorizer.Authorize(Permissions.ManageImageGallery, T("Couldn't upload media file"))) {
                return new HttpUnauthorizedResult();
            }
            viewModel.AllowedFiles = _imageGalleryService.AllowedFileFormats;

            if (!ModelState.IsValid)
                return View(viewModel);

            try {
                if (viewModel.ImageFiles == null || viewModel.ImageFiles.Count() == 0 || viewModel.ImageFiles.First() == null) {
                    ModelState.AddModelError("File", T("Select a file to upload").ToString());

                    return View(viewModel);
                }

                if (viewModel.ImageFiles.Any(file => !_imageGalleryService.IsFileAllowed(file))) {
                    ModelState.AddModelError("File", T("That file type is not allowed.").ToString());
                    return View(viewModel);
                }

                foreach (var file in viewModel.ImageFiles) {
                    _imageGalleryService.AddImage(viewModel.ImageGalleryName, file);
                }
            }
            catch (Exception exception) {
                Services.Notifier.Error(T("Adding image failed: {0}", exception.Message));
                return View(viewModel);
            }

            return RedirectToAction("Images", new {imageGalleryName = viewModel.ImageGalleryName});
        }

        public ActionResult EditImage(string imageGalleryName, string imageName) {
            if (!Services.Authorizer.Authorize(Permissions.ManageImageGallery, T("Cannot edit image"))) {
                return new HttpUnauthorizedResult();
            }

            return
                View(new ImageEditViewModel {ImageGalleryName = imageGalleryName, Image = _imageGalleryService.GetImage(imageGalleryName, imageName)});
        }

        [HttpPost]
        [FormValueRequired("submit.Save")]
        public ActionResult EditImage(ImageEditViewModel viewModel) {
            if (!Services.Authorizer.Authorize(Permissions.ManageImageGallery, T("Cannot edit image"))) {
                return new HttpUnauthorizedResult();
            }

            try {
                // TODO: Use an validation framewok on model, this is temporary
                if (viewModel.Image.Caption != null && viewModel.Image.Caption.Length > 255)
                {
                    ModelState.AddModelError("Caption", T("The caption length should not be longer than 255 characters").ToString());
                    return
                        View(new ImageEditViewModel
                             {
                                 ImageGalleryName = viewModel.ImageGalleryName,
                                 Image = _imageGalleryService.GetImage(viewModel.ImageGalleryName, viewModel.Image.Name)
                             });
                }

                try {
                    _imageGalleryService.UpdateImageProperties(viewModel.ImageGalleryName, viewModel.Image.Name,
                                                               viewModel.Image.Title, viewModel.Image.Caption);
                }
                catch (Exception exception) {
                    Services.Notifier.Error(T("Editing image properties failed: {0}", exception.Message));
                    return
                        View(new ImageEditViewModel
                             {
                                 ImageGalleryName = viewModel.ImageGalleryName,
                                 Image = _imageGalleryService.GetImage(viewModel.ImageGalleryName, viewModel.Image.Name)
                             });
                }

                Services.Notifier.Information(T("Image properties successfully modified"));
            }
            catch (Exception exception) {
                Services.Notifier.Error(T("Saving image failed: {0}", exception.Message));
            }

            return RedirectToAction("Images", new {imageGalleryName = viewModel.ImageGalleryName});
        }

        [HttpPost]
        [FormValueRequired("submit.DeleteImage")]
        [ActionName("EditImage")]
        public ActionResult DeleteImage(string imageGalleryName, string imageName) {
            if (!Services.Authorizer.Authorize(Permissions.ManageImageGallery, T("Cannot delete image"))) {
                return new HttpUnauthorizedResult();
            }

            try {
                _imageGalleryService.DeleteImage(imageGalleryName, imageName);

                Services.Notifier.Information(T("Image successfully deleted"));
            }
            catch (Exception exception) {
                Services.Notifier.Error(T("Deleting image failed: {0}", exception.Message));
            }

            return RedirectToAction("Images", new {imageGalleryName});
        }

        [HttpPost]
        [FormValueRequired("submit.Delete")]
        [ActionName("EditProperties")]
        public ActionResult Delete(string imageGalleryName) {
            if (!Services.Authorizer.Authorize(Permissions.ManageImageGallery, T("Cannot delete image gallery"))) {
                return new HttpUnauthorizedResult();
            }

            try {
                _imageGalleryService.DeleteImageGallery(imageGalleryName);
                Services.Notifier.Information(T(string.Format("Image gallery \"{0}\" deleted", imageGalleryName)));
            }
            catch (Exception exception) {
                Services.Notifier.Error(T("Deleting image gallery failed: {0}", exception.Message));
            }

            return RedirectToAction("Index");
        }

        public JsonResult Reorder(string imageGalleryName, IEnumerable<string> images) {
            if (!Services.Authorizer.Authorize(Permissions.ManageImageGallery, T("Cannot delete image gallery"))) {
                return Json(new HttpUnauthorizedResult());
            }

            _imageGalleryService.ReorderImages(imageGalleryName, images);

            return new JsonResult();
        }
    }
}