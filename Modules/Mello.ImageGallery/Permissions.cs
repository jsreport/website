using System.Collections.Generic;
using Orchard.Environment.Extensions.Models;
using Orchard.Security.Permissions;

namespace Mello.ImageGallery {
    public class Permissions : IPermissionProvider {
        public static readonly Permission ManageImageGallery = new Permission {Description = "Managing Image Gallery", Name = "ManageImageGallery"};

        public virtual Feature Feature { get; set; }

        public IEnumerable<Permission> GetPermissions() {
            return new[]
                   {
                       ManageImageGallery,
                   };
        }

        public IEnumerable<PermissionStereotype> GetDefaultStereotypes() {
            return new[]
                   {
                       new PermissionStereotype
                       {
                           Name = "Administrator",
                           Permissions = new[] {ManageImageGallery}
                       },
                       new PermissionStereotype
                       {
                           Name = "Editor",
                           Permissions = new[] {ManageImageGallery}
                       },
                       new PermissionStereotype
                       {
                           Name = "Moderator",
                       },
                       new PermissionStereotype
                       {
                           Name = "Author",
                           Permissions = new[] {ManageImageGallery}
                       },
                       new PermissionStereotype
                       {
                           Name = "Contributor",
                       },
                   };
        }
    }
}