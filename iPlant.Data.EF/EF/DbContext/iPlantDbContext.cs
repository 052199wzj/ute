using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Configuration;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using iPlant.Data.EF.Repository;
using iPlant.Common.Tools;

namespace iPlant.Data.EF
{
    public class iPlantDbContext : DbContext, IDisposable
    {
        private string ConnectionString { get; set; }

        private DBEnumType mDBEnumType { get; set; }

         

        #region 构造函数
        public iPlantDbContext(DBEnumType wDBEnumType, string connectionString) : base()
        {
            mDBEnumType = wDBEnumType;
            ConnectionString = connectionString;
        }
        #endregion

        #region 重载
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            switch (mDBEnumType)
            {
                
                case DBEnumType.MySQL:
                    optionsBuilder.UseMySql(ConnectionString, ServerVersion.AutoDetect(ConnectionString), options => {
                        options.CommandTimeout(RepositoryFactory.DBCommandTimeOut);
                    });
                    break;
                case DBEnumType.SQLServer:
                    optionsBuilder.UseSqlServer(ConnectionString, p => p.CommandTimeout(RepositoryFactory.DBCommandTimeOut));
                    break;
                case DBEnumType.Default:
                    optionsBuilder.UseMySql(ConnectionString, ServerVersion.AutoDetect(ConnectionString), options => {
                        options.CommandTimeout(RepositoryFactory.DBCommandTimeOut);
                    });
                    break;
                case DBEnumType.Oracle: 
                case DBEnumType.Access: 
                default:
                    throw new Exception("暂不支持的数据库类型"); 
            }
           
            optionsBuilder.AddInterceptors(new DbCommandCustomInterceptor());
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            Assembly entityAssembly = Assembly.Load(new AssemblyName("iPlant.FMS.Models")); // todo
            IEnumerable<Type> typesToRegister = entityAssembly.GetTypes().Where(p => !string.IsNullOrEmpty(p.Namespace))
                                                                         .Where(p => !string.IsNullOrEmpty(p.GetCustomAttribute<TableAttribute>()?.Name));
            foreach (Type type in typesToRegister)
            {
                dynamic configurationInstance = Activator.CreateInstance(type);
                modelBuilder.Model.AddEntityType(type);
            }
            foreach (var entity in modelBuilder.Model.GetEntityTypes())
            {
                PrimaryKeyConvention.SetPrimaryKey(modelBuilder, entity.Name);
                string currentTableName = modelBuilder.Entity(entity.Name).Metadata.GetTableName();
                modelBuilder.Entity(entity.Name).ToTable(currentTableName);

                //var properties = entity.GetProperties();
                //foreach (var property in properties)
                //{
                //    ColumnConvention.SetColumnName(modelBuilder, entity.Name, property.Name);
                //}
            }

            base.OnModelCreating(modelBuilder);
        }
        #endregion
    }
}
