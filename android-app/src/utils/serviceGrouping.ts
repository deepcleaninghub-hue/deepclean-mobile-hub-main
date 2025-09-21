import { ServiceOption } from '../services/serviceOptionsAPI';

export interface GroupedService {
  id: string;
  baseTitle: string;
  description: string;
  image: string;
  category: string;
  options: ServiceOption[];
  minPrice: number;
  maxPrice: number;
  priceRange: string;
  duration: string;
}

/**
 * Groups service options by their base title (removing size/type suffixes)
 * For example: "Bed Cleaning - Small", "Bed Cleaning - Medium", "Bed Cleaning - Large"
 * will be grouped under "Bed Cleaning"
 */
export function groupServicesByBaseTitle(serviceOptions: ServiceOption[]): GroupedService[] {
  const groupedMap = new Map<string, ServiceOption[]>();
  
  // Group services by base title
  serviceOptions.forEach(option => {
    const baseTitle = extractBaseTitle(option.title);
    if (!groupedMap.has(baseTitle)) {
      groupedMap.set(baseTitle, []);
    }
    groupedMap.get(baseTitle)!.push(option);
  });
  
  // Convert to GroupedService objects
  const groupedServices: GroupedService[] = [];
  
  groupedMap.forEach((options, baseTitle) => {
    if (options.length === 0) return;
    
    // Sort options by price
    const sortedOptions = options.sort((a, b) => a.price - b.price);
    
    // Use the first option for common properties
    const firstOption = sortedOptions[0];
    
    const groupedService: GroupedService = {
      id: `grouped_${baseTitle.toLowerCase().replace(/\s+/g, '_')}`,
      baseTitle,
      description: firstOption.description,
      image: firstOption.services?.category || 'default',
      category: firstOption.services?.category || '',
      options: sortedOptions,
      minPrice: sortedOptions[0].price,
      maxPrice: sortedOptions[sortedOptions.length - 1].price,
      priceRange: sortedOptions.length === 1 
        ? `€${sortedOptions[0].price.toFixed(2)}`
        : `€${sortedOptions[0].price.toFixed(2)} - €${sortedOptions[sortedOptions.length - 1].price.toFixed(2)}`,
      duration: firstOption.duration
    };
    
    groupedServices.push(groupedService);
  });
  
  // Sort grouped services by base title
  return groupedServices.sort((a, b) => a.baseTitle.localeCompare(b.baseTitle));
}

/**
 * Extracts the base title from a service option title
 * Removes common size/type suffixes like "- Small", "- Medium", "- Large", etc.
 */
function extractBaseTitle(title: string): string {
  // Common patterns to remove from the end of titles
  const patterns = [
    /\s*-\s*(Small|Medium|Large|XL|XXL|Extra Large|Extra Small)$/i,
    /\s*-\s*(Basic|Standard|Premium|Deluxe|Luxury)$/i,
    /\s*-\s*(1|2|3|4|5|6|7|8|9|10)\s*(Bed|Room|Person|Hour|Day|Week|Month)$/i,
    /\s*\(\s*(Small|Medium|Large|Basic|Standard|Premium)\s*\)$/i,
    /\s*-\s*(Single|Double|Twin|Queen|King|Full)$/i,
  ];
  
  let baseTitle = title.trim();
  
  // Try each pattern
  for (const pattern of patterns) {
    const match = baseTitle.match(pattern);
    if (match) {
      baseTitle = baseTitle.replace(pattern, '').trim();
      break;
    }
  }
  
  return baseTitle;
}

/**
 * Checks if a service should be grouped (has multiple size/type options)
 */
export function shouldGroupService(serviceOptions: ServiceOption[]): boolean {
  if (serviceOptions.length <= 1) return false;
  
  const baseTitles = new Set(
    serviceOptions.map(option => extractBaseTitle(option.title))
  );
  
  return baseTitles.size === 1 && serviceOptions.length > 1;
}

/**
 * Gets the display title for a grouped service
 */
export function getGroupedServiceDisplayTitle(groupedService: GroupedService): string {
  return groupedService.baseTitle;
}

/**
 * Gets the display description for a grouped service
 */
export function getGroupedServiceDisplayDescription(groupedService: GroupedService): string {
  const optionCount = groupedService.options.length;
  const sizeText = optionCount === 1 ? '1 option' : `${optionCount} options`;
  
  return `${groupedService.description} (${sizeText} available)`;
}
